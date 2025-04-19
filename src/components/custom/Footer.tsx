import { FacebookIcon } from "@/components/icons/Facebook";
import { InstagramIcon } from "@/components/icons/Instagram";

export const Footer = () => {
  return (
    <footer className="bg-[#373737] text-muted p-10">
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 relative">
          <div className="w-full md:w-1/3">
            <h3 className="text-base font-semibold mb-4">
              Мы в социальных сетях
            </h3>
            <ul className="flex gap-4">
              <li className="hover:text-gray-600 transition-colors">
                <a
                  href="https://www.facebook.com/ukraineurbanwood/"
                  className="flex items-center gap-2"
                >
                  <FacebookIcon className="fill-white size-8" />
                </a>
              </li>
              <li className="hover:text-gray-600 transition-colors">
                <a
                  href="https://www.instagram.com/urbanwood_odessa/"
                  className="flex items-center gap-2"
                >
                  <InstagramIcon className="fill-white size-8" />
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-base font-semibold mb-4">Популярная мебель</h3>
            <ul className="space-y-2">
              <li className="hover:text-gray-600 text-sm transition-colors">
                <a href="#">Мебель на заказ в Одессе</a>
              </li>
              <li className="hover:text-gray-600 text-sm transition-colors">
                <a href="#">Мебель в стиле Loft</a>
              </li>
              <li className="hover:text-gray-600 text-sm transition-colors">
                <a href="#">Шкафы на заказ в Одессе</a>
              </li>
              <li className="hover:text-gray-600 text-sm transition-colors">
                <a href="#">Классические кухни</a>
              </li>
              <li className="hover:text-gray-600 text-sm transition-colors">
                <a href="#">Столы</a>
              </li>
            </ul>
          </div>
          {/* Added this to force second list to move to the left */}
          <div></div>
        </div>
      </div>
    </footer>
  );
};
