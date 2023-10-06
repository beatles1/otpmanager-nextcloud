import React, { createContext, useState, useEffect } from "react";
import { UserSetting } from "../model/UserSetting";
import axios from "@nextcloud/axios";
import { generateUrl } from "@nextcloud/router";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

const initState = new UserSetting(false, null, null);

const UserSettingContext = createContext(initState);

const UserSettingContextProvider = ({ children }) => {
  const [state, setState] = useState(initState);

  useEffect(() => {
    if (!state.toUpdate) return;

    axios
      .post(generateUrl("/apps/otpmanager/settings"), JSON.stringify(state), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch((error) => {
        showNotification({
          id: "update-user-setting",
          color: "red",
          title: "Error",
          message: "Something went wrong while updating your settings",
          autoClose: 2000,
          icon: <IconX size={16} />,
        });
      });
  }, [state]);

  useEffect(() => {
    fetch("/apps/otpmanager/settings")
      .then((response) => response.json())
      .then((result) => setState(UserSetting.fromJson(result)))
      .catch((error) => setState(initState));
  }, []);

  return (
    <UserSettingContext.Provider value={[state, setState]}>
      {children}
    </UserSettingContext.Provider>
  );
};

export { UserSettingContext, UserSettingContextProvider };
