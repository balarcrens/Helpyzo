// import { useContext, useState } from "react"
// import DataContext from "./DataContext"
// import ToastContext from "../Toast/ToastContext";

// export default function DataProvider({ children }) {
//     const [partners, setPartners] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const { setToast } = useContext(ToastContext);

//     const fetchPartners = async () => {
//         try {
//             // 
//         } catch (error) {
//             console.log(error.message);
//             setToast(error.message || "Failed to fetch partners", "error");
//         }
//     }

//     const fetchPartnerDetail = async (partnerId) => {
//         try {
//             // 
//         } catch (error) {
//             console.log(error.message);
//             setToast(error.message || "Failed to fetch partners details", "error");
//         }
//     }

//     const deletePartner = async (partnerId) => {
//         try {
//             // 
//             setToast("Partner delete successfully", "success");
//         } catch (error) {
//             console.log(error.message);
//             setToast(error.message || "Failed to fetch partners", "error");
//         }
//     }

//     return (
//         <DataContext.Provider value={{ partners, setPartners, loading, setLoading, fetchPartners, deletePartner, fetchPartnerDetail }}>
//             {children}
//         </DataContext.Provider>
//     )
// }
