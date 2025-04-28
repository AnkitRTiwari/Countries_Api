import { useRouteError } from "react-router";

const Error = () => {
  const error = useRouteError();
  console.log(error.error);

  return <div>Something went wrong</div>;
};

export default Error;
