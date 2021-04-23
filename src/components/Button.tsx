import tw from "twin.macro";
const Button = tw.button`
  text-base
  font-bold
  py-2
  px-6
  bg-[#475885]
  rounded
  text-white
  uppercase
  cursor-pointer
  disabled:opacity-30 
  disabled:cursor-not-allowed
  hover:opacity-70
`;

export default Button;
