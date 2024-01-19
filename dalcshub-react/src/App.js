import { Routes, Route, BrowserRouter } from "react-router-dom";
import {
  MainFeed,
  FAQ,
  Contact,
  LandingPage,
  BrowseCourses,
  CreatePost,
  Login,
  Register,
  CourseDetail,
  CreateComment,
} from "./pages";
import { NavBar } from "./components";
import { ModeProvider, ThemeProvider, UserProvider, SnackbarProvider, GuardedRoute } from "./providers";
import { CssBaseline } from "@mui/material";

function App() {
  return (
    <ModeProvider>
      <ThemeProvider>
        <CssBaseline />
        <UserProvider>
          <BrowserRouter>
            <SnackbarProvider>
              <NavBar />
              <Routes>
                <Route exact path="/" element={<LandingPage />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/register" element={<Register />} />
                <Route exact path="/main" element={<GuardedRoute component={<MainFeed />}/>} />
                <Route exact path="/browse-courses" element={<GuardedRoute component={<BrowseCourses />}/>} />
                <Route exact path="/create-post/:courseNumber" element={<GuardedRoute component={<CreatePost />}/>} />
                <Route exact path="/course-details/:courseNumber" element={<GuardedRoute component={<CourseDetail />} />}/>
                <Route exact path="/faq" element={<GuardedRoute component={<FAQ />}/>} />
                <Route exact path="/contact" element={<GuardedRoute component={<Contact />}/>} />
                <Route exact path="/comment/:post_id" element={<GuardedRoute component={<CreateComment/>} />}/>
              </Routes>
            </SnackbarProvider>
          </BrowserRouter>
        </UserProvider>
      </ThemeProvider>
    </ModeProvider>
  );
}

export default App;
