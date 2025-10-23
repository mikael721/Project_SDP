import { AppShell } from "@mantine/core";
import React from "react";

const LoginPage = () => {
  return (
    <AppShell header={{ height: 0 }} padding="md">
      <AppShell.Header></AppShell.Header>
      <AppShell.Main>
        <div>LoginPage</div>
      </AppShell.Main>
    </AppShell>
  );
};

export default LoginPage;
