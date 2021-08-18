export function httpProm(
  url: string,
  method: 'GET' | 'POST' | 'PUT' = 'GET'
): Promise<string> {
  const http = new XMLHttpRequest();
  return new Promise((res, rej) => {
    http.open(method, url);
    http.send();
    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status < 400) {
        res(http.responseText);
      }
    };
  });
}

export function condContent(
  test: any,
  conditionalContent: JSX.Element,
  alt: JSX.Element | '' = ''
) {
  // This is just a teeeeeeny bit cleaner than the normal way to do conditional content in jsx
  // {testVal ? (
  //   conditional content
  // ) : (
  //   ''
  // )}F
  return test ? conditionalContent : alt;
}

export function onlyUnique<T>(v: T, i: number, arr: T[]): boolean {
  return arr.indexOf(v) === i;
}
