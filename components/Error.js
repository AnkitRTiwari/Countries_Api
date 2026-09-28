import { Link, useRouteError } from "react-router";
import EmptyState from "./EmptyState";
import { useDocumentTitle } from "../utilis/brand";

const Error = () => {
  const error = useRouteError();
  console.log(error?.error);
  useDocumentTitle("Something went wrong");

  return (
    <main className="error-page">
      <EmptyState
        icon="triangle-exclamation"
        title="Oops! Something went wrong"
        action={
          <Link to="/" className="button">
            <i className="fa-solid fa-house" /> Back to home
          </Link>
        }
      >
        {error?.statusText || error?.message || "Unknown error"}
      </EmptyState>
    </main>
  );
};

export default Error;
