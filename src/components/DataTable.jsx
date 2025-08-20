import { Copy, Clipboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const DataTable = ({
  passwordArray,
  setPasswordArray,
  formData,
  setFormData,
}) => {
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    itemId: null,
    itemUrl: "",
  });

  const [copiedStates, setCopiedStates] = useState({});

  const handleCopy = (text, itemId, field) => {
    const copyId = `${itemId}-${field}`;

    setCopiedStates((prev) => ({ ...prev, [copyId]: true }));
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [copyId]: false }));
    }, 1000);

    navigator.clipboard.writeText(text);
  };

  const handleEdit = (id) => {
    const itemToEdit = passwordArray.find((i) => i.id === id);
    setFormData({ ...itemToEdit, Id: id });
    setPasswordArray(passwordArray.filter((item) => item.id !== id));
  };

  const handleDelete = async (id) => {
    const item = passwordArray.find((item) => item.id === id);
    setDeleteModal({ isOpen: true, itemId: id, itemUrl: item?.url || "" });
  };

  const confirmDelete = async () => {
    const id = deleteModal.itemId;
    await fetch("http://localhost:3000/", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPasswordArray(passwordArray.filter((item) => item.id !== id));
    
    setDeleteModal({ isOpen: false, itemId: null, itemUrl: "" });
    await getPasswords();
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, itemId: null, itemUrl: "" });
  };

  const getDisplayName = (url) => {
    try {
      const fullUrl = url.startsWith("http") ? url : `https://${url}`;
      const hostname = new URL(fullUrl).hostname;
      const domain = hostname.replace(/^www\./, "");
      const siteName = domain.split(".")[0];

      return siteName.charAt(0).toUpperCase() + siteName.slice(1);
    } catch (error) {
      return url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0] || url;
    }
  };

  return (
    <div className="table-data w-full flex justify-center mb-20">
      <table class="table-auto w-3/4 text-center rounded-lg overflow-hidden max-sm:w-[95%] max-sm:table-fixed">
        <thead className=" bg-yellow-400">
          <tr>
            <th className="py-1.5 w-2/5 max-sm:max-w-[35%] font-serif">Url</th>
            <th className="py-1.5 w-1/5 max-sm:max-w-[20%] font-serif">Id</th>
            <th className="py-1.5 w-1/5 max-sm:max-w-[20] font-serif">
              Password
            </th>
            <th className="py-1.5 w-1/5 max-sm:max-w-[25%] font-serif">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-yellow-100 bg-[radial-gradient(circle_400px_at_90%_250px,#fff90035,#d5c5ff60)] ">
          {passwordArray.map((item, index) => {
            const urlCopyId = `${index}-url`;
            const usernameCopyId = `${index}-username`;
            const passwordCopyId = `${index}-password`;
            return (
              <tr key={index}>
                <td className="py-1.5 px-1">
                  <div className="link flex justify-center items-center gap-3 max-sm:gap-1 overflow-hidden">
                    <a
                      className="text-lg max-sm:text-md hover:underline truncate"
                      href={item.url}
                      target="_blank"
                    >
                      {getDisplayName(item.url)}
                    </a>
                    <CopyButton
                      text={item.url}
                      copyId={urlCopyId}
                      isCopied={copiedStates[urlCopyId]}
                      onCopy={() => handleCopy(item.url, index, "url")}
                    />
                  </div>
                </td>
                <td className="py-1.5 px-1">
                  <div className="link flex justify-center items-center gap-3 max-sm:gap-1 overflow-hidden">
                    <span className="text-md truncate">{item.username}</span>
                    <CopyButton
                      text={item.url}
                      copyId={usernameCopyId}
                      isCopied={copiedStates[usernameCopyId]}
                      onCopy={() =>
                        handleCopy(item.username, index, "username")
                      }
                    />
                  </div>
                </td>
                <td className="py-1.5 px-1">
                  <div className="link flex justify-center items-center gap-3 max-sm:gap-1 overflow-hidden">
                    <span className="text-md truncate">
                      {"*".repeat(item.password.length)}
                    </span>
                    <CopyButton
                      text={item.url}
                      copyId={passwordCopyId}
                      isCopied={copiedStates[passwordCopyId]}
                      onCopy={() =>
                        handleCopy(item.password, index, "password")
                      }
                    />
                  </div>
                </td>
                <td className="py-1.5">
                  <div className="link flex justify-center items-center gap-8 max-sm:gap-2">
                    <div
                      onClick={() => {
                        handleEdit(item.id);
                      }}
                      className="edit-tool hover:cursor-pointer font-medium flex justify-center items-center gap-2"
                    >
                      <span className="max-sm:hidden">Edit</span>
                      <lord-icon
                        src="https://cdn.lordicon.com/lrubprlz.json"
                        trigger="click"
                        style="width:22px;height:22px"
                      ></lord-icon>
                    </div>
                    <div
                      onClick={() => {
                        handleDelete(item.id);
                      }}
                      className="delete-tool hover:cursor-pointer font-medium flex justify-center items-center gap-2"
                    >
                      <span className="max-sm:hidden">Delete</span>
                      <lord-icon
                        src="https://cdn.lordicon.com/oqeixref.json"
                        trigger="click"
                        style="width:22px;height:22px"
                      ></lord-icon>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        itemUrl={deleteModal.itemUrl}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

const DeleteConfirmationModal = ({ isOpen, itemUrl, onConfirm, onCancel }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-gradient-to-br from-yellow-50 to-purple-50 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="mb-6">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <lord-icon
                    src="https://cdn.lordicon.com/wpyrrmcq.json"
                    trigger="loop"
                    style={{ width: "32px", height: "32px" }}
                  ></lord-icon>
                </div>
                <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-2">
                  Delete Password Entry
                </h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to delete this password entry?
                </p>
                <div className="bg-yellow-100 rounded-lg p-3 border border-yellow-200">
                  <p className="text-sm text-gray-700 font-medium">
                    <span className="font-serif">URL : </span> {itemUrl}
                  </p>
                </div>
                <p className="text-sm text-red-600 mt-3 font-medium">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onCancel}
                  className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg font-bold hover:bg-gray-300 transition-colors font-sans"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onConfirm}
                  className="px-6 py-2.5 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors font-sans"
                >
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const CopyButton = ({ isCopied, onCopy }) => (
  <div className="relative inline-block">
    <motion.button
      onClick={onCopy}
      className="flex items-center justify-center relative p-0.5 hover:cursor-pointer"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isCopied ? "clipboard" : "copy"}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isCopied ? <Clipboard size={16} /> : <Copy size={16} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>

    {isCopied && (
      <motion.div
        className="absolute inset-0 rounded-full border-1 border-black"
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 1.2, opacity: 0 }}
        transition={{ duration: 1 }}
      />
    )}
  </div>
);

export default DataTable;
