// https://stackoverflow.com/questions/48011353/how-to-unwrap-type-of-a-promise
// Typescript magic for unwrapping the resolve type of a promise
export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export function httpProm(
  url: string,
  options?: {
    method?: "GET" | "POST" | "PUT";
    body?: any;
  }
): Promise<string> {
  const http = new XMLHttpRequest();
  const method = options?.method || "GET";

  return new Promise((res, rej) => {
    http.open(method, url);
    console.log("Body I think Im sending");
    console.log(options?.body);
    http.send(JSON.stringify(options?.body));
    http.onreadystatechange = () => {
      if (http.readyState === 4 && http.status < 400) res(http.responseText);
    };
  });
}

export function condContent(
  test: any,
  conditionalContent: JSX.Element,
  alt: JSX.Element | "" = ""
) {
  // This is just a teeeeeeny bit cleaner than the normal way to do conditional content in jsx
  // {testVal ? (
  //   conditional content
  // ) : (
  //   ''
  // )}
  return test ? conditionalContent : alt;
}

export function onlyUnique<T>(v: T, i: number, arr: T[]): boolean {
  return arr.indexOf(v) === i;
}

// Slightly utility function for adding multiple css classes from a module
export function getStyles(
  styles: { [key: string]: string },
  // style names split by spaces, becuase that's how classic html does it
  classes: string
): string {
  return (
    classes
      .split(" ")
      // Filter out any empty strings
      .filter((cssClass) => !!cssClass)
      .map((c) => styles[c])
      .join(" ")
  );
}

export function getContentWidth(el: HTMLElement | null) {
  if (!el) return;
  const style = getComputedStyle(el);
  return (
    el.clientWidth -
    parseFloat(style.paddingLeft) -
    parseFloat(style.paddingRight)
  );
}

export type InputChange = React.ChangeEvent<HTMLInputElement>;
