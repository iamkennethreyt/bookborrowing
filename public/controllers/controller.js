app.controller("appController", [
  "$scope",
  "$http",
  function(state, http) {
    state.initialData = "KONSEHAL";
    const validatator = (params, param2) => {
      if (!params) {
        alert(`PLEASE INPUT ${param2}`);
        return null;
      }
    };

    state.onChange = () => {
      state.initialData = "KONS RANSEN";
    };

    state.signin = () => {
      if (!state.password || !state.email) {
        validatator(state.firstName, "FIRST NAME");
        validatator(state.password, "PASSWORD");
      } else {
        http
          .post("/api/signin", {
            email: state.email,
            password: state.password
          })
          .then(res => {
            state.onChange();
            // alert(res.data);
            alert("sucessfully logged in");
          })
          .then(() => {
            state.onChange();
            window.location = "/?#!";
            state.onChange();
          });
      }
    };

    // state.initialData = state.finalData;

    state.signup = () => {
      validatator(state.firstName, "FIRST NAME");
      validatator(state.lastName, "LAST NAME");
      validatator(state.email, "EMAIL");
      validatator(state.password, "PASSWORD");

      if (state.password != state.confirmPassword) {
        alert("YOUR PASSWORD DONT MATCH! PLEASE TRY AGAIN");
        return null;
      } else {
        http
          .post("/api/registerUser", {
            firstName: state.firstName,
            lastName: state.lastName,
            email: state.email,
            password: state.password
          })
          .then((res, err) => {
            if (!err) {
              alert(res.data);
            }
            state.initialData = "Ransen";
          })
          .then(() => {
            window.location.href("/");
          });
      }
    };
  }
]);
