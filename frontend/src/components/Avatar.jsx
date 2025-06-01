// Description: Avatar component with a radial mask effect

export const Avatar = ({src, alt, size = 50, className = ""}) => {
    return (
        <div
        className={`relative inline-block overflow-hidden rounded-full ${className}`}
        style={{ width: size, height: size }}
        >
        <img
            src={src}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
        />
        <div
            className="absolute inset-0 bg-gradient-to-r from-transparent to-black opacity-50"
            style={{ borderRadius: "50%" }}
        ></div>
        </div>
    );
}