const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const header = req.headers.authorization;

    console.log("🔐 verifyToken middleware hit");
    console.log("  Authorization header:", header);

    if (!header) {
        console.log("   No authorization header");
        return res.status(401).json({ error: "No token provided" });
    }

    const token = header.split(" ")[1];
    if (!token) {
        console.log("   Invalid token format");
        return res.status(401).json({ error: "Invalid token format" });
    }

    console.log("  Token:", token.substring(0, 20) + "...");
    console.log("  JWT_SECRET exists:", !!process.env.JWT_SECRET);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("  Token verified, user ID:", decoded.id);
        req.user = decoded; 
        next();
    } catch (err) {
        console.log("  Token verification failed:", err.message);
        res.status(403).json({ error: "Invalid or expired token" });
    }
};
