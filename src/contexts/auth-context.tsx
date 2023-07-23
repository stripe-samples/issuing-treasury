import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";

type User = {
  id: string;
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
  SIGN_IN = "SIGN_IN",
  SIGN_OUT = "SIGN_OUT",
}

type Action =
  | { type: ActionTypes.INITIALIZE; payload?: User }
  | { type: ActionTypes.SIGN_IN; payload: User }
  | { type: ActionTypes.SIGN_OUT };

const initialState: State = {
  isAuthenticated: false,
  isLoading: true,
  user: {
    // TODO: Use actual user data
    name: "snasir-1",
  },
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
  [ActionTypes.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  [ActionTypes.SIGN_OUT]: (state) => {
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

export const AuthContext = createContext<State>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated =
        window.sessionStorage.getItem("authenticated") === "true";
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      const user: User = {
        id: "5e86809283e28b96d2d38537",
        avatar: "/assets/avatars/avatar-anika-visser.png",
        name: "Anika Visser",
        email: "anika.visser@devias.io",
      };

      dispatch({
        type: ActionTypes.INITIALIZE,
        payload: user,
      });
    } else {
      dispatch({
        type: ActionTypes.INITIALIZE,
      });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  const skip = () => {
    try {
      window.sessionStorage.setItem("authenticated", "true");
    } catch (err) {
      console.error(err);
    }

    const user: User = {
      id: "5e86809283e28b96d2d38537",
      avatar: "/assets/avatars/avatar-anika-visser.png",
      name: "Anika Visser",
      email: "anika.visser@devias.io",
    };

    dispatch({
      type: ActionTypes.SIGN_IN,
      payload: user,
    });
  };

  const signIn = async (email: string, password: string) => {
    if (email !== "demo@devias.io" || password !== "Password123!") {
      throw new Error("Please check your email and password");
    }

    try {
      window.sessionStorage.setItem("authenticated", "true");
    } catch (err) {
      console.error(err);
    }

    const user: User = {
      id: "5e86809283e28b96d2d38537",
      avatar: "/assets/avatars/avatar-anika-visser.png",
      name: "Anika Visser",
      email: "anika.visser@devias.io",
    };

    dispatch({
      type: ActionTypes.SIGN_IN,
      payload: user,
    });
  };

  const signUp = async (email: string, name: string, password: string) => {
    throw new Error("Sign up is not implemented");
  };

  const signOut = () => {
    dispatch({
      type: ActionTypes.SIGN_OUT,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        skip,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
