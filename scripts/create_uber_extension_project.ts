/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2022 Looker Data Sciences, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Create Uber Extension Project.
 *
 * This script creates an extension project that contains compiled versions
 * of all of the extensions in this repo. To use do the following:
 *
 * 1. Run npm install - to initialize this project.
 * 2. Run npm run build (to compile all of extension projects).
 * 3. Create the target directory, the default is `../uberext`.
 * 4. Run npm run uberext (to create the uber extension project).
 *    NOTE WELL - this will delete the `uberext/dist` directory.
 * 5. Run git init on `../uberext`
 * 6. Create a repo for it in github (or the git host of your choice)
 * 7. Push the branch to the git repo.
 * 8. Create a project in you Looker instance and point to the repo
 *    created in step 7.
 * 9. Deploy.
 *
 * At this point, the extensions should be available in your Looker
 * instance.
 */

import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import fs from 'fs'

interface ExtensionInfo {
  applicationName: string
  manifest: string
  distPath: string
}

const { source, target, project, connection, devurl } = parseAndValidateArgs()

const extensions: ExtensionInfo[] = findExtensions(source, [])

buildUberExtension(project, target, connection, extensions, devurl)

console.log(`${project} extension project built`)

function findExtensions(dirname: string, extensions: ExtensionInfo[]) {
  const files = fs.readdirSync(dirname)
  const distPath = `${dirname}/dist`
  const hasDistDir = isValidDirectory(distPath)
  const manifestPath = `${dirname}/manifest.lkml`
  const hasManifest = isValidFile(manifestPath)
  if (hasManifest && hasDistDir) {
    const pathParts = dirname.split('/')
    const applicationName = pathParts[pathParts.length - 1]
    extensions.push({
      applicationName,
      distPath,
      manifest: fs.readFileSync(manifestPath, 'utf-8'),
    })
  }
  files
    .filter(
      (file) =>
        !file.startsWith('.') && file !== 'node_modules' && file !== 'dist'
    )
    .forEach((file) => {
      if (!file.startsWith('.')) {
        const path = `${dirname}/${file}`
        if (isValidDirectory(path)) {
          findExtensions(path, extensions)
        }
      }
    })
  return extensions
}

function buildUberExtension(
  project: string,
  target: string,
  connection: string,
  extensions: ExtensionInfo[],
  devurl: boolean
) {
  createModelFile(project, target, connection)
  createManifestFile(project, target, extensions, devurl)
  createTargetDistDir(target)
  extensions.forEach((extension) => copyDistFiles(target, extension))
}

function createModelFile(project: string, target: string, connection: string) {
  fs.writeFileSync(
    `${target}/${project}.model.lkml`,
    `connection: "${connection}"
`
  )
}

function createManifestFile(
  project: string,
  target: string,
  extensions: ExtensionInfo[],
  devurl: boolean
) {
  let manifest = `project_name: "${project}"\n`
  extensions.forEach(
    (extension) => (manifest += extractApplication(project, extension, devurl))
  )
  fs.writeFileSync(`${target}/manifest.lkml`, manifest)
}

function extractApplication(
  project: string,
  extension: ExtensionInfo,
  devurl: boolean
) {
  const lines = extension.manifest
    .split('\n')
    .filter(
      (line) =>
        !line.trim().startsWith('project_name') && !line.trim().startsWith('#')
    )

  let appStarted = false
  let counter = 0
  const appLines = ['']
  lines.forEach((line) => {
    const trimmedLine = line.trim().split('#')[0]
    if (appStarted) {
      if (trimmedLine.startsWith('url') || trimmedLine.startsWith('file')) {
        return
      }
      if (trimmedLine.startsWith('label')) {
        appLines.push(
          line.substring(0, line.lastIndexOf('"')) + ` (${project})"`
        )
      } else {
        appLines.push(line)
      }
      if (trimmedLine.indexOf('{')) {
        counter++
      }
      if (trimmedLine.indexOf('}')) {
        counter--
      }
      if (counter == 0) {
        appStarted = false
      }
    } else {
      if (trimmedLine.startsWith('application')) {
        appLines.push(line)
        appStarted = true
        counter = 1
        if (devurl) {
          appLines.push(
            `  # file: "dist/${extension.applicationName}/bundle.js"`
          )
          appLines.push(`  url: "https://localhost:8080/bundle.js"`)
        } else {
          appLines.push(`  file: "dist/${extension.applicationName}/bundle.js"`)
          appLines.push(`  # url: "https://localhost:8080/bundle.js"`)
        }
      }
    }
  })
  return appLines.join('\n')
}

function createTargetDistDir(target: string) {
  const distDir = `${target}/dist`
  if (isValidDirectory(distDir)) {
    fs.rmSync(distDir, { recursive: true })
  }
  fs.mkdirSync(distDir)
}

function copyDistFiles(target: string, extension: ExtensionInfo) {
  const distDir = `${target}/dist/${extension.applicationName}`
  const files = fs.readdirSync(extension.distPath)
  files
    .filter(
      (file) =>
        file.endsWith('.js') || file.endsWith('.txt') || file.endsWith('.map')
    )
    .forEach((file) => {
      if (!isValidDirectory(distDir)) {
        fs.mkdirSync(distDir)
      }
      fs.copyFileSync(`${extension.distPath}/${file}`, `${distDir}/${file}`)
    })
}

function parseAndValidateArgs() {
  const args = yargs(hideBin(process.argv))
    .usage(
      'Generate single extension project containing extensions in a directory'
    )
    .options({
      source: {
        description: 'directory containing exensions to be included',
        type: 'string',
        default: '.',
        required: true,
        alias: 's',
      },
      target: {
        description: 'directory where extension project is to be created',
        type: 'string',
        default: '../uberext',
        required: true,
        alias: 't',
      },
      project: {
        description:
          'name of project (alphanumeric, dashes and underscores only)',
        type: 'string',
        default: 'uberext',
        required: true,
        alias: 'p',
      },
      connection: {
        description: 'name of the connection',
        type: 'string',
        default: 'thelook',
        required: true,
        alias: 'c',
      },
      devurl: {
        description: 'generate development url',
        type: 'boolean',
        default: 'false',
        required: true,
        alias: 'd',
      },
    })
  const { source, target, project, connection, devurl } = args.argv
  if (!isValidDirectory(source)) {
    args.showHelp()
    console.error(`Invalid directory: source ${source}`)
    process.exit(1)
  }
  if (!isValidDirectory(target)) {
    args.showHelp()
    console.error(`Invalid directory: target ${target}`)
    process.exit(1)
  }
  if (!/^[a-zA-Z0-9-_]+$/.test(project)) {
    args.showHelp()
    console.error(`Invalid project name: project ${project}`)
    process.exit(1)
  }
  return { source, target, project, connection, devurl: Boolean(devurl) }
}

function isValidDirectory(name: string) {
  if (!fs.existsSync(name)) {
    return false
  }
  if (!fs.lstatSync(name).isDirectory()) {
    return false
  }
  return true
}

function isValidFile(name: string) {
  if (!fs.existsSync(name)) {
    return false
  }
  if (!fs.lstatSync(name).isFile()) {
    return false
  }
  return true
}
