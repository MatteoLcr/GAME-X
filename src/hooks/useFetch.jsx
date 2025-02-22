// export default function UseFetch(url) {
//     const [data, setData] = useState([])

//     useEffect(() => {
//         async function fetchData() {
//             const response = await fetch(url)
//             const data = await response.json()
//             setData(data.results)
//         }
//         fetchData()
//     }, [])

//     return data
// }