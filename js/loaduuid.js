import { random_uuid } from "../library/uuidlib.js";

if (!localStorage.uuid) {
    localStorage.uuid = random_uuid();
    console.log("New UUID generated and stored:", localStorage.uuid);
} else {
    console.log("Existing UUID found:", localStorage.uuid);
}