import colors from "colors";
import server from "./server";

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(colors.cyan.bold(`REST API en http://localhost:${PORT}`));
});
