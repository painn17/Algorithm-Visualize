function CustomButton({ callback, children, color }) {
  return (
    <button
      className={`${
        color ? color : "bg-blue-500"
      } text-white rounded-xl p-2 cursor-pointer hover:brightness-110 transition-all`}
      onClick={() => {
        callback();
      }}
    >
      {children}
    </button>
  );
}

export default CustomButton;
