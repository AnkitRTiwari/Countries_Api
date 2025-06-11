import { useRouteError } from "react-router";

const Error = () => {
  const error = useRouteError();
  console.log(error?.error);

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Oops! Something went wrong 😢</h1>
      <p>{error?.statusText || error?.message || "Unknown error"}</p>

      <img
        src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnhxeWpta2pyZzUxanNsbG16NDdzN3NxMjI5d2hrcnFzNWFid2lrYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kePYfGmpNtzAQ/giphy.gif"
        alt="error gif"
        style={{ width: "300px", marginTop: "1rem" }}
      />
    </div>
  );
};

export default Error;
