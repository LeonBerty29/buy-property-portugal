import clsx from 'clsx';
import Image from 'next/image';

export function GridTileImage({
  isInteractive = true,
  ...props
}: {
  isInteractive?: boolean;
} & React.ComponentProps<typeof Image>) {
  return (
    <div className="group flex h-full w-full items-center justify-center overflow-hidden rounded-lg">
      {props.src ? (
        <Image
          alt={"Image"}
          src={props.src}
          width={400}
          height={400}
          className={clsx('relative h-full w-full object-cover', {
            'transition duration-300 ease-in-out group-hover:scale-105': isInteractive
          })}
          // {...props}
        />
      ) : null}
    </div>
  );
}