import { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { motion, AnimatePresence } from "framer-motion";
import DataTable from "./DataTable";
import { v4 as uuidv4 } from "uuid";

const Manager = () => {
  const [formData, setFormData] = useState({
    url: "",
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordArray, setPasswordArray] = useState([]);
  const addIconRef = useRef();



  useEffect(() => {
      getPasswords();
  }, []);



  const addRefAnimation = () => {
    if (addIconRef.current && addIconRef.current.playerInstance) {
      addIconRef.current.playerInstance.stop();
      setTimeout(() => {
        addIconRef.current.playerInstance.play();
      }, 50);
    }
  };




  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };




  const getPasswords = async () => {
    let data = await fetch("http://localhost:3000/");
    let passwords = await data.json();
    console.log(passwords);
    setPasswordArray(passwords);
  };




  const savePassword = async () => {
    if (
      formData.url.length > 3 &&
      formData.username.length > 3 &&
      formData.password.length > 3
    ) {
      console.log(formData);

      if (formData.Id) {
        await fetch("http://localhost:3000/", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: formData.Id }),
        });
      }

      const newId = uuidv4();
      const passwordData = { ...formData, id: newId };
      delete passwordData.Id;

      await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });

      setFormData({ url: "", username: "", password: "" });
      await getPasswords();
    }
  };




  const handleAddByEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      savePassword();
    }
  };

  return (
    <>
      <div className="main-content flex flex-col items-center mt-[8vh] mb-10 gap-5">
        <div className="flex flex-col items-center gap-3">
          <div className="main-tittle text-4xl font-bold">Vaultify</div>
          <div className="sub-tittle text-lg font-[400]">
            Keeps your password safe
          </div>
        </div>
        <div className="inputs w-full max-sm:w-[90%] flex flex-col items-center gap-5">
          <div className="url-input w-full flex justify-center">
            <input
              name="url"
              value={formData.url}
              onChange={handleChange}
              onKeyDown={handleAddByEnter}
              type="text"
              placeholder="Website url/name"
              className=" w-1/2 max-sm:w-[90%] border-2 border-black rounded-xl px-3 py-[3px] focus-within:outline-none"
            />
          </div>
          <div className="main-input w-1/2 max-sm:w-full flex justify-center items-center gap-5 relative z-5 max-sm:flex-wrap">
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              onKeyDown={handleAddByEnter}
              type="text"
              placeholder="Username/Id"
              className="w-3/5 max-sm:w-[90%] border-2 border-black rounded-xl px-3 py-[3px] focus-within:outline-none"
            />
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleAddByEnter}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-2/5 max-sm:w-[90%] border-2 border-black rounded-xl px-3 pr-10 py-[3px] focus-within:outline-none"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 max-sm:right-8 max-sm:top-14.5  cursor-pointer"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={showPassword ? "view" : "viewoff"}
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: 90, opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  style={{ transformPerspective: "1000px" }}
                >
                  <HugeiconsIcon
                    icon={showPassword ? ViewIcon : ViewOffIcon}
                    size={24}
                    color="#000000"
                    strokeWidth={1.5}
                  />
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
          <div className="submit-btn mt-5">
            <button
              onClick={() => {
                savePassword();
                addRefAnimation();
              }}
              className="bg-purple-400 px-3 py-1 rounded-full flex justify-center items-center gap-2.5 font-medium text-md hover:cursor-pointer hover:bg-none"
            >
              <lord-icon
                ref={addIconRef}
                src="https://cdn.lordicon.com/efxgwrkc.json"
                trigger="hover"
                style="width:25px;height:25px"
                colors="primary:#000000"
              ></lord-icon>
              Save
            </button>
          </div>
        </div>
        <div className="passwordList w-full mx-auto mt-8">
          {passwordArray.length === 0 && (
            <div className="font-bold text-3xl flex justify-center mt-5 opacity-50">
              No Passwords To Show
            </div>
          )}
          {passwordArray.length != 0 && (
            <DataTable
              passwordArray={passwordArray}
              setPasswordArray={setPasswordArray}
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
