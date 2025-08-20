import "./app.css";
import Navbar from "./components/Navbar";
import Manager from "./components/Manager";
import Footer from "./components/Footer";



export function App() {
  return (
    <>
    <div className="background bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
    <div className="second-bg bg-[radial-gradient(circle_1000px_at_100%_100px,#d5c5ff,#fff90025)]">
    <Navbar/>
    <Manager/>
    <Footer/>
    </div>
    </div>
    </>
  );
}
