import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "../Container/Container";
import { useSelector } from "react-redux";
import Logo from "../Logo";
import LogoutBtn from "./Logout";

const Header = () => {
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  console.log(authStatus);

  const navItems = [
    {
      name: "Home",
      slug: "/home",
      active: true,
    },

    {
      name: "All Posts",
      slug: "/allposts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/addpost",
      active: authStatus,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Register",
      slug: "/register",
      active: !authStatus,
    },
  ];

  return (
    <header>
      <Container>
        <div className="w-full flex justify-between items-center">
          <div>
            <Link to="/">
              <Logo width="70px" />
            </Link>
          </div>

          <nav className="flex items-center justify-center gap-3">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <button onClick={() => navigate(item.slug)}>
                      {item.name}
                    </button>
                  </li>
                )
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
};

export default Header;
