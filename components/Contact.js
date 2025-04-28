import { useParams } from "react-router";

const Contact = () => {
  const param = useParams();
  console.log(param);
  return <div>Contact Us</div>;
};

export default Contact;
