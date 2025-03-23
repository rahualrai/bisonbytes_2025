import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
// import * as tf from "@tensorflow/tfjs-node"; // Optional for future models

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const predictEmergency = async (req, res) => {
  try {
    const pythonScript = path.join(__dirname, "../../models/ml_model.py");
    const pythonProcess = spawn("python", [pythonScript]);

    let pythonOutput = "";
    pythonProcess.stdout.on("data", (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python stderr:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      if (code !== 0) {
        return res.status(500).json({
          status: "error",
          message: "Python subprocess exited with code " + code,
        });
      }
      try {
        const result = JSON.parse(pythonOutput);
        res.json(result);
      } catch (err) {
        res.status(500).json({
          status: "error",
          message:
            "Failed to parse Python output: " + err.message,
        });
      }
    });

    pythonProcess.stdin.write(JSON.stringify(req.body));
    pythonProcess.stdin.end();
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

export default { predictEmergency };