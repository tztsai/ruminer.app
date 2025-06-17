/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable functional/no-class */
import NextDocument, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

import { getCssText, globalStyles } from "../../tokens/stitches.config";

export default class Document extends NextDocument {
  render() {
    globalStyles();

    return (
      <Html lang="en" dir="ltr">
        <Head>
          <style
            id="stitches"
            dangerouslySetInnerHTML={{ __html: getCssText() }}
          />
          <link rel="manifest" href="/manifest.webmanifest" />
          <Script strategy={"beforeInteractive"} src={"/env.js"} />

          {/* prefetch (not preload) fonts that will be used by the reader */}
          <link rel="prefetch" href="/static/fonts/Lora/Lora-Regular.ttf" />
          <link rel="prefetch" href="/static/fonts/Lora/Lora-Bold.ttf" />
          <link rel="prefetch" href="/static/fonts/Lora/Lora-Italic.ttf" />
          <link
            rel="prefetch"
            href="/static/fonts/Merriweather/Merriweather-Regular.ttf"
          />
          <link
            rel="prefetch"
            href="/static/fonts/Merriweather/Merriweather-Bold.ttf"
          />
          <link
            rel="prefetch"
            href="/static/fonts/Merriweather/Merriweather-Italic.ttf"
          />
          <link
            rel="prefetch"
            href="/static/fonts/Open_Sans/OpenSans-Regular.ttf"
          />
          <link
            rel="prefetch"
            href="/static/fonts/Open_Sans/OpenSans-Bold.ttf"
          />
          <link
            rel="prefetch"
            href="/static/fonts/Open_Sans/OpenSans-Italic.ttf"
          />
          <link rel="prefetch" href="/static/fonts/Roboto/Roboto-Regular.ttf" />
          <link rel="prefetch" href="/static/fonts/Roboto/Roboto-Bold.ttf" />
          <link rel="prefetch" href="/static/fonts/Roboto/Roboto-Italic.ttf" />
          <link
            rel="prefetch"
            href="/static/fonts/Crimson_Text/CrimsonText-Regular.ttf"
          />
          <link
            rel="prefetch"
            href="/static/fonts/Crimson_Text/CrimsonText-Bold.ttf"
          />
          <link
            rel="prefetch"
            href="/static/fonts/Crimson_Text/CrimsonText-Italic.ttf"
          />
          <link
            rel="prefetch"
            href="/static/fonts/Source_Serif_Pro/SourceSerifPro-Regular.ttf"
          />
          <link
            rel="prefetch"
            href="/static/fonts/Source_Serif_Pro/SourceSerifPro-Bold.ttf"
          />
          <link
            rel="prefetch"
            href="/static/fonts/Source_Serif_Pro/SourceSerifPro-Italic.ttf"
          />
          <link rel="prefetch" href="/static/fonts/SFMono/SFMonoRegular.otf" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
