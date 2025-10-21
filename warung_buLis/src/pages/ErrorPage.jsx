import { useRouteError } from "react-router";

const ErrorPage = () => {
  const error = useRouteError();
  console.log(error);

  return (
    <div
      style={{
        backgroundColor: "#83358f",
        color: "white",
        height: "100vh",
        paddingTop: "10vh",
        boxSizing: "border-box",
      }}>
      <img
        src="https://media.tenor.com/hgaPyfjpKjsAAAAe/sad-cat.png"
        alt="error"
        style={{
          width: "300px",
          height: "300px",
          display: "block",
          margin: "auto",
        }}
      />
      <h1 style={{ textAlign: "center" }}>
        Wah Error: {error?.statusText || "Unknown Error"} (
        {error?.status || "Unknown Status"})
      </h1>
      <h2 style={{ textAlign: "center" }}>
        {error?.message || "Something went wrong!"}
      </h2>
    </div>
  );
};

export default ErrorPage;
