function reducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      if (action.payload.isAuthenticated) {
        return {
          ...state,
          isAuthenticated: true,
          user: action.payload.user,
        };
      } else {
        return {
          ...state,
          isAuthenticated: false,
          user: action.payload.user,
        };
      }
    case "PROFILE_UPDATE":
      console.log(action.payload.user, "coming from reducer");

      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
      };
    case "DASHBOARD_LOGOUT":
      localStorage.removeItem("NexaCuraIsAuthenticated");
      return {
        ...state,
        isAuthenticated: false,

        user: {
          ...state.user,
        },
      };
    case "AVATAR_ANSWER":
      return {
        ...state,
        avatarAnswer: action.payload,
      };
    default:
      return state;
  }
}

export default reducer;
