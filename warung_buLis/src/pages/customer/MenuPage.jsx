import { AppShell } from "@mantine/core";
import { setLogin,setLogout } from '../../slice + storage/userSlice'
import { useDispatch, useSelector } from "react-redux";


const MenuPage = () => {

  let token = useSelector((d) => d.user.userToken);

  return (
    <AppShell header={{ height: 0 }} padding="md">
      <AppShell.Main>
        <div>
          MainPage
        </div>
      </AppShell.Main>
    </AppShell>
  );
};

export default MenuPage;
