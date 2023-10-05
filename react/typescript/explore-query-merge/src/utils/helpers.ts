export const getHostname = (url:string) => {
    var matches = url.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    var hostname = matches && matches[0];
    return hostname;
}

export const getQID = (url:string) => {
    if(url.includes("qid=")) {
      const qid = url.split("qid=")[1].split("&")[0].replace(/\s+/g, '');
      if(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(qid)) {
        return "URL_ERROR"
      } else {
        return qid
      }
    } else {
      return "URL_ERROR"
    }
}

export const Range = (n: number) => Array.from({length: n}, (value, key) => key)