interface OperatorImageProps {
  id: string;
  name: string;
}

const OperatorImage = ({ id, name }: OperatorImageProps) => {
  const baseUrl =
    "https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/";
  const srcUrl = `${baseUrl}/${id}.png`;
  return <img src={srcUrl} alt={name} />;
};

export default OperatorImage;
