import { useRouteError } from "react-router";

const ErrorPage = (props) => {
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
        alt="errror"
        style={{
          width: "300px",
          height: "300px",
          display: "block",
          margin: "auto",
        }}
      />
      <h1 style={{ textAlign: "center" }}>
        Wah Error: {error?.statusText ?? props.statusText}(
        {error?.status ?? props.status})
      </h1>
      <h2 style={{ textAlign: "center" }}>
        {error?.error?.message ?? props.message}
      </h2>
    </div>
  );
};

export default ErrorPage;
