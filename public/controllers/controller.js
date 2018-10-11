let instance = {};

app.controller("appController", [
  "$scope",
  "$http",
  function(state, http) {
    state.user = instance;

    //FUNCTION VALIDATOR
    const validatator = (params, param2) => {
      if (!params) {
        alert(`PLEASE INPUT ${param2}`);
        return null;
      }
    };

    //FUNCTION FOR POST PET
    state.post = () => {
      console.log(state.instance);
      console.log(state.details);

      let filestr = document.getElementById("myFile").value;
      let newObject = {
        ID: instance.ID,
        title: state.title,
        details: state.details,
        firstname: instance.firstName,
        lastname: instance.lastName,
        email: instance.email,
        image: filestr.replace("C:\\fakepath\\", "\\")
      };
      http.post("/api/postpet", newObject).then((res, err) => {
        if (!err) {
          $("#btn-close").trigger("click");
          state.posts.unshift(newObject);
          state.posts;
          alert(res.data);
        }
      });
    };

    //FUNCTION FOR SIGNIN
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
            if (res.data === "INVALID USER NAME OR PASSWORD") {
              alert(res.data);
            } else {
              alert("YOU ARE SUCCESSFULLY LOGGED IN");
              instance = res.data[0];
              window.location.href = "#!/";
            }
          });
      }
    };

    //API FOR SHOW THE POST LISTS
    http.get("/api/postlist").then(res => {
      state.posts = res.data;
    });

    //FUNCTION UPDATE PROFILE
    state.editprofile = () => {
      state.firstName = instance.firstName;
      state.lastName = instance.lastName;
      state.details = instance.details;
      state.image = instance.image;

      state.submiteditedprofile = () => {
        http
          .post("/api/updateprofile", {
            firstName: state.firstName,
            lastName: state.lastName,
            details: state.details,
            image: state.image,
            ID: instance.ID
          })
          .then(res => {
            instance.firstName = state.firstName;
            instance.lastName = state.lastName;
            instance.details = state.details;
            instance.image = state.image;
            alert(res.data);
            $("#btn-close").trigger("click");
          });
      };
    };

    //FUNCTION FOR SIGNUP
    state.signup = () => {
      validatator(state.firstName, "FIRST NAME");
      validatator(state.lastName, "LAST NAME");
      validatator(state.email, "EMAIL");
      validatator(state.password, "PASSWORD");

      if (state.password != state.confirmPassword) {
        alert("YOUR PASSWORD DONT MATCH! PLEASE TRY AGAIN");
        return null;
      } else {
        instance.firstName = state.firstName;
        instance.lastName = state.lastName;
        instance.email = state.email;
        instance.password = state.password;
        http
          .post("/api/registerUser", {
            firstName: state.firstName,
            lastName: state.lastName,
            email: state.email,
            password: state.password
          })
          .then((res, err) => {
            if (!err) {
              console.log(res.data.length);
              if (res.data.length < 5) {
                instance.ID = res.data;
                window.location.href = "#!/";
              } else {
                alert(res.data);
              }
            }
          });
      }
    };
  }
]);
