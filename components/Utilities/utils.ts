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
    // This seems like the simplest option, a
    http.setRequestHeader("Content-Type", "text/plain");
    // IGNORED IF THE REQUEST IS GET
    http.send(JSON.stringify(options?.body));
    http.onreadystatechange = () =>
      http.readyState === 4
        ? http.status < 400
          ? res(http.responseText)
          : rej(http.responseText)
        : "";
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

// Utility function for adding multiple css classes from a module
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

// I use this in a couple places to get components to re-render as I change screen size
// To review how event listener options work. This is a good way to do disconnection
// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
export function forceUpdateResizeEffect(forceUpdate: () => void) {
  const disconnector = new AbortController();
  window.addEventListener("resize", forceUpdate, disconnector);
  return () => disconnector.abort();
}

export type InputChange = React.ChangeEvent<HTMLInputElement>;
