import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";

import { fetchApi } from "src/utils/api-helpers";

type User = {
  id: string;
  accountId: string;
  avatar: string;
  name: string;
  email: string;
};

type State = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
};

enum ActionTypes {
  INITIALIZE = "INITIALIZE",
  REGISTRATION_SUCCEEDED = "REGISTRATION_SUCCEEDED",
  LOGIN_SUCCEEDED = "LOGIN_SUCCEEDED",
  LOGOUT_SUCCEEDED = "LOGOUT_SUCCEEDED",
}

type Action =
  | { type: ActionTypes.INITIALIZE; payload?: User }
  | { type: ActionTypes.REGISTRATION_SUCCEEDED; payload: User }
  | { type: ActionTypes.LOGIN_SUCCEEDED; payload: User }
  | { type: ActionTypes.LOGOUT_SUCCEEDED; payload?: undefined };

const initialState: State = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

const handlers: Record<ActionTypes, (state: State, action: Action) => State> = {
  [ActionTypes.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(user
        ? {
            isAuthenticated: true,
            isLoading: false,
            user,
          }
        : {
            isLoading: false,
          }),
    };
  },
  [ActionTypes.REGISTRATION_SUCCEEDED]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user: user ?? null,
    };
  },
  [ActionTypes.LOGIN_SUCCEEDED]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user: user ?? null,
    };
  },
  [ActionTypes.LOGOUT_SUCCEEDED]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
};

const reducer = (state: State, action: Action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext<{
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (email: string, name: string, password: string) => void;
}>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: () => ({}),
  logout: () => ({}),
  register: () => ({}),
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const router = useRouter();
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    isAuthenticated = window.sessionStorage.getItem("authenticated") === "true";

    if (isAuthenticated) {
      const userString = window.sessionStorage.getItem("user");
      if (userString) {
        const user: User = JSON.parse(userString);
        dispatch({
          type: ActionTypes.INITIALIZE,
          payload: user,
        });
      } else {
        dispatch({
          type: ActionTypes.INITIALIZE,
        });
      }
    } else {
      dispatch({
        type: ActionTypes.INITIALIZE,
      });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    const body = { name: name, email: email, password: password };
    const response = await fetchApi("/api/register", body);
    const data = await response.json();

    if (response.ok) {
      const user: User = {
        id: data.userId,
        accountId: data.accountId,
        avatar: "/assets/avatars/avatar-anika-visser.png",
        name: data.businessName,
        email: data.userEmail,
      };

      window.sessionStorage.setItem("authenticated", "true");
      window.sessionStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: ActionTypes.REGISTRATION_SUCCEEDED,
        payload: user,
      });

      if (data.requiresOnboarding === true) {
        router.push("/onboard");
      } else {
        router.push("/");
      }
    } else {
      throw new Error(`Registration failed: ${data.error}`);
    }
  };

  const login = async (email: string, password: string) => {
    const body = { email: email, password: password };
    const response = await fetchApi("/api/login", body);
    const data = await response.json();

    if (response.ok) {
      const user: User = {
        id: data.userId,
        accountId: data.accountId,
        avatar: "/assets/avatars/avatar-anika-visser.png",
        name: data.businessName,
        email: data.userEmail,
      };

      window.sessionStorage.setItem("authenticated", "true");
      window.sessionStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: ActionTypes.LOGIN_SUCCEEDED,
        payload: user,
      });

      if (data.requiresOnboarding === true) {
        router.push("/onboard");
      } else {
        router.push("/");
      }
    } else {
      throw new Error(`Login failed: ${data.error}`);
    }
  };

  const logout = async () => {
    const response = await fetchApi("/api/logout");

    if (response.ok) {
      window.sessionStorage.setItem("authenticated", "false");
      window.sessionStorage.removeItem("user");

      dispatch({
        type: ActionTypes.LOGOUT_SUCCEEDED,
      });

      router.push("/auth/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login: login,
        register: register,
        logout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
