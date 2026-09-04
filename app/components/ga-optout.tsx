import Script from "next/script";

/**
 * Sets gtag's per-device kill switch from a localStorage flag.
 * Visit /?ga=off on a device to stop it being tracked, /?ga=on to resume.
 */
export default function GaOptOut({ gaId }: { gaId: string }) {
  const code = `(function(){try{
var k='ga-optout';
var m=location.search.match(/[?&]ga=(on|off)/);
if(m)localStorage.setItem(k,m[1]==='off'?'1':'0');
if(localStorage.getItem(k)==='1')window['ga-disable-${gaId}']=true;
}catch(e){}})();`;

  return (
    <Script id="ga-optout" strategy="beforeInteractive">
      {code}
    </Script>
  );
}
