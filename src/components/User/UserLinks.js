export default function UserLinks({ links }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {links.map((link) => (
        <div
          key={link.url}
          className="h-52 group relative rounded-lg shadow-lg p-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500  hover:to-blue-500 transition-all duration-300 transform hover:scale-105"
        >
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col justify-evenly gap-5  h-full  no-underline"
          >
            <h3 className="text-3xl uppercase font-bold text-white group-hover:text-gray-200">
              {link.title}
            </h3>
            <p className="text-sm text-gray-100 group-hover:text-gray-300 truncate">
              {link.url}
            </p>
          </a>
          <div className="absolute bottom-2 right-2 text-xs text-gray-200 opacity-80">
            <span>Click to visit</span>
          </div>
        </div>
      ))}
    </div>
  );
}
