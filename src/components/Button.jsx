function CustomButton({ callback, children, color, textSize = "text-sm" }) {
  return (
    <button
      className={`${
        color ? color : "bg-accent hover:bg-accent-hover"
      } ${textSize} text-white rounded-xl p-2 cursor-pointer hover:brightness-110 transition-all`}
      onClick={() => {
        callback();
      }}
    >
      {children}
    </button>
  );
}

export default CustomButton;
