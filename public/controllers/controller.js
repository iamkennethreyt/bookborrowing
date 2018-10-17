app.controller("appController", [
  "$scope",
  "$http",
  function(state, http) {
    //FUNCTION VALIDATOR
    const validatator = (params, param2) => {
      if (!params) {
        alert(`PLEASE INPUT ${param2}`);
        return null;
      }
    };

    //FUNCTION FOR SIGNIN
    state.signin = () => {
      if (!state.password || !state.username) {
        validatator(state.username, "USERNAME");
        validatator(state.password, "PASSWORD");
      } else {
        http
          .post("/api/signin", {
            username: state.username,
            password: state.password
          })
          .then(res => {
            if (res.data === "SUCCESSFULLY LOGIN") {
              alert(res.data);
              window.location.href = "/#!/dashboardbooklist";
            } else {
              alert(res.data);
            }
          });
      }
    };

    //FUNCTION ON UPDATE POST
    state.onUpdateBook = param => {
      state.title = param.title;
      state.author = param.author;
      state.qty = param.qty;

      state.updatebook = () => {
        http
          .post("/api/updatebook", {
            ID: param.ID,
            title: state.title,
            author: state.author,
            qty: state.qty
          })
          .then(res => {
            param.title = state.title;
            param.author = state.author;
            param.qty = state.qty;
            alert(res.data);
            $("#btn-close2").trigger("click");
            document.getElementById("form2").reset();
          });
        // console.log(state.title + " " + state.author + " " + state.qty);
      };
    };

    //FUNCTION ON UPDATE POST
    state.onUpdateBorrower = param => {
      state.firstname = param.firstname;
      state.lastname = param.lastname;
      state.profession = param.profession;
      state.address = param.address;

      state.updateborrower = () => {
        http
          .post("/api/updateborrower", {
            ID: param.ID,
            firstname: state.firstname,
            lastname: state.lastname,
            profession: state.profession,
            address: state.address
          })
          .then(res => {
            param.firstname = state.firstname;
            param.lastname = state.lastname;
            param.profession = state.profession;
            param.address = state.address;
            alert(res.data);
            $("#btn-close2").trigger("click");
            document.getElementById("form2").reset();
          });
      };
    };

    //FUNCTION FOR ADD NEW BOOK
    state.addbook = () => {
      let newObject = {
        title: state.title,
        author: state.author,
        qty: state.qty
      };
      http.post("/api/addbook", newObject).then((res, err) => {
        $("#btn-close").trigger("click");
        state.books.unshift(newObject);
        state.books;
        alert(res.data);
        document.getElementById("form").reset();
      });
    };

    //FUNCTION FOR ADD NEW BORROWER
    state.addborrower = () => {
      const newObject = {
        firstname: state.firstname,
        lastname: state.lastname,
        profession: state.profession,
        address: state.address
      };
      http.post("/api/addborrower", newObject).then((res, err) => {
        $("#btn-close").trigger("click");
        state.borrowers.unshift(newObject);
        state.borrowers;
        alert(res.data);
        document.getElementById("form").reset();
      });
    };

    //API FOR SHOW THE BOOKS LISTS
    http.get("/api/borrowerslist").then(res => {
      state.borrowers = res.data;
      state.countborrowers = res.data.length;
    });

    //API FOR SHOW THE BORROWERS LISTS
    http.get("/api/booklist").then(res => {
      state.books = res.data;
      state.countbooks = res.data.length;
    });

    //API FOR SHOW THE BOOK BORROWERS LISTS
    const showbookborrower = () => {
      http.get("/api/readmanagebookborrowers").then(res => {
        state.bookborrowers = res.data;
        state.countmanagebook = res.data.length;
      });
    };
    showbookborrower();

    //DELETE BOOK
    state.onDeleteBook = param => {
      if (confirm("Are you sure you want to delete this borrower?")) {
        state.books.splice(state.books.indexOf(param), 1);
        http
          .post("/api/deletebook", {
            ID: param.ID
          })
          .then(res => {
            alert(res.data);
          });
      }
    };

    //DELETE BORROWER
    state.onDeleteBorrower = param => {
      if (confirm("Are you sure you want to delete this borrower?")) {
        state.borrowers.splice(state.borrowers.indexOf(param), 1);
        http
          .post("/api/deleteborrower", {
            ID: param.ID
          })
          .then(res => {
            alert(res.data);
          });
      }
    };

    //MANAGE BOOK BORROWERRS
    state.managebookborrower = () => {
      http
        .post("/api/managebookborrower", {
          bookID: state.bookID,
          borrowerID: state.borrowerID
        })
        .then((res, err) => {
          $("#btn-close").trigger("click");
          alert(res.data);
          document.getElementById("form").reset();
          showbookborrower();
        });
    };

    //ARCHIVE BOOK BORROWERS
    state.onArchive = id => {
      if (confirm("are you sure do you want to archive this data?")) {
        http.post("/api/archive", { id }).then(res => {
          alert(res.data);
          showbookborrower();
        });
      }
    };

    //ON SIGNOUT
    state.onSignOut = () => {
      if (confirm("Are you sure do you want to logout?")) {
        window.location.href = "/#!/index";
      }
    };
  }
]);
