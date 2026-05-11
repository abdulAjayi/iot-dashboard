function ShowModal({ setShowModal, sendCommand, setShutWell, shutWell }) {
  const current = shutWell;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-xl p-6 w-80 shadow-xl">
        <h3 className="text-white font-bold text-lg mb-2">
          {shutWell ? "REINSTATE WELL?" : "SHUT WELL?"}
        </h3>
        <p className="text-gray-400 text-sm mb-6">
          {shutWell
            ? "This will bring the well back online. Are you sure?"
            : "This will shut the well completely. Are you sure?"}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              sendCommand("shut_well", true);
              setShowModal(false);
              setShutWell(!current);
            }}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-500"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShowModal;
