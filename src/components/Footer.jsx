import React from "react";

const Footer = () => {
  return (
    <footer className="bg-neutral-700 w-full h-[6vh] flex gap-10 fixed bottom-0">
      <div className="container px-15 mx-auto flex items-center justify-center gap-1">
        <p className="text-xl text-white font-bold max-sm:text-lg max-sm:font-medium">
          Made by Prem Mishra with{" "}
        </p>
        <span className="pt-1">
          <lord-icon
            src="https://cdn.lordicon.com/gbkitytd.json"
            trigger="hover"
            colors="primary:red"
            style="width:28px;height:28px"
          ></lord-icon>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
