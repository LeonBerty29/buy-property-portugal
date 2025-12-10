import { Testimonial } from "@/types/testimonial";

export const ClientTestimonialCard = ({ data }: { data: Testimonial }) => {
  // console.log({ data });

  return (
    <>
      <div className="p-5 md:p-8 lg:p-14 h-full w-full flex flex-col gap-4 justify-center items-center text-center bg-gray-100 rounded-xl">
        <div className="space-y-1">
          <p className="text-2xl font-bold text-gray-800">{data.name}</p>
          <p className="text-gray-800 text-sm">{data.date}</p>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: data.content }}
          className="lg:w-[85%] mx-auto text-gray-600"
        />
      </div>
    </>
  );
};
