import { useRef, useState } from "react";
import FetchingModal from "./FetchingModal";

const Interface = () => {
  const [url, setUrl] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const textRef = useRef<HTMLSpanElement>(null);

  const handleCopyUrl = () => {
    const text = textRef.current?.innerText;
    if (text) {
      navigator.clipboard.writeText(text).then((_) => null);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setIsFetching(true);

    try {
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url }),
      });

      if (response.ok) {
        const data = await response.json();
        setShortenedUrl(data.shortUrl);
      }
    } catch (error) {
      console.log(`Error: ${error}`);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div>
      <div className="rounded-md border border-[#313284] bg-gray-900 shadow-md">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-center text-2xl font-bold uppercase leading-6 text-white">
            Get a shortened URL
          </h1>
          <div className="my-4 max-w-xl text-sm text-gray-400">
            <p>
              Paste in your long url and click the button to get a shortened
              URL.
            </p>
          </div>
          <form className="mt-5 sm:flex sm:items-center">
            <div className="w-full sm:max-w-xs">
              <label htmlFor="email" className="sr-only">
                URL
              </label>
              <input
                type="text"
                id="url"
                name={url}
                onChange={(e) => setUrl(e.target.value)}
                className="block w-full rounded-md border-0 bg-gray-900 p-4 py-1.5 text-white shadow-sm ring-1 ring-inset ring-indigo-700 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                placeholder="https://somethingverylong.com/"
              />
            </div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-[#364897] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:ml-3 sm:mt-0 sm:w-auto"
            >
              Shorten
            </button>
          </form>
          {shortenedUrl && (
            <div className="mt-4 flex w-full items-center justify-between py-4">
              <span ref={textRef} className="font-mono text-gray-200">
                {isCopied ? "Copied!" : shortenedUrl}
              </span>
              <div>
                <button className="text-gray-300" onClick={handleCopyUrl}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 256 256"
                  >
                    <path
                      fill="currentColor"
                      d="M172 156a12 12 0 0 1-12 12H96a12 12 0 0 1 0-24h64a12 12 0 0 1 12 12Zm-12-52H96a12 12 0 0 0 0 24h64a12 12 0 0 0 0-24Zm60-56v168a20 20 0 0 1-20 20H56a20 20 0 0 1-20-20V48a20 20 0 0 1 20-20h34.53a51.88 51.88 0 0 1 74.94 0H200a20 20 0 0 1 20 20Zm-92-12a28 28 0 0 0-27.71 24h55.42A28 28 0 0 0 128 36Zm68 16h-17.41A52.13 52.13 0 0 1 180 64v8a12 12 0 0 1-12 12H88a12 12 0 0 1-12-12v-8a52.13 52.13 0 0 1 1.41-12H60v160h136Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {isFetching && <FetchingModal />}
    </div>
  );
};

export default Interface;
