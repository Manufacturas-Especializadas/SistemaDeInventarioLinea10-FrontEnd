import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react"
import { toast, Toaster } from "sonner";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

export default function Salidas(){
    const[salidas, setSalidas] = useState([]);

    useEffect(() => {
        const fechtSalidas = async () => {
            await toast.promise(
                fetch('https://app-mesa-sistemadeinventario-api-prod.azurewebsites.net/api/Salidas/ObtenerSalidas')
                    .then((response) => {
                        if(!response.ok){
                            throw new Error(`Error ${ response.status }: ${ response.statusText }`);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log("Datos recibidos de la API de entradas: ", data);
                        setSalidas(data);
                    }),
                {
                    loading: "Cargando los datos...",
                    success: "Datos cargados correctamente",
                    error: (error) => {
                        console.log("Error fetching data: ", error);
                        return `Ocurrio un error al cargar los datos: ${ error.message }`
                    },
                }
            );
        };
        fechtSalidas();
    }, []);

    const handleExport = async () => {
        try {
            const url = "https://app-mesa-sistemadeinventario-api-prod.azurewebsites.net/api/Salidas/DescargarExcel";

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",                    
                },
                body: null
            });

            if(!response.ok){
                throw new Error(`Error: ${response.status}`);                
            }
            const blob = await response.blob();

            const urlBlob = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = urlBlob;
            link.setAttribute("download", "DatosExportadosSalidas.xlsx");
            document.body.appendChild(link);
            link.click();

            link.remove();
        } catch (error) {
            console.log("Error al exportar el excel: ", error);
        }
    }

    const columns = [
        {
            field: "numeroDeParte", 
            headerName: "NÚMERO DE PARTE", 
            flex: 1
        },
        {
            field: "cantidad", 
            headerName: "CANTIDAD", 
            flex: 1 
        },
        {
            field: "fechaDeSalida",
            headerName: "FECHA DE SALIDA",
            flex: 1
        }
    ];

    return(
        <>
            <h1 className="text-center text-5xl uppercase font-bold mb-2">
                Salidas
            </h1>

            <Toaster position="top-right" richColors/>

            <div className="flex justify-end">
                <Button 
                    color="secondary" 
                    startIcon={<CloudDownloadIcon/>}
                    onClick={ handleExport }
                >
                    Descargar información
                </Button>
            </div>

            <Box sx={{ height: 400, width: '100%', background: "#fff" }}>
                <DataGrid
                    rows={ salidas }
                    columns={ columns }
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                />
            </Box>
        </>
    )
}