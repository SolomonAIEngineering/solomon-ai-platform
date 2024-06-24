"use client";

import { cn } from "@midday/ui/cn";
import Image, { StaticImageData } from "next/image";

import { Fragment, useState } from "react";

/**
 * @typedef {Object} ImageType
 * @property {number} id - The id of the image.
 * @property {StaticImageData} src - The source of the image.
 * @property {StaticImageData} src2 - The source of the image.
 */
export type ImageType = {
    id: number;
    src: StaticImageData;
    src2: StaticImageData;
};

/*
 * Empty state component props.
 * 
 * @interface EmptyStatePaneProps
 * @extends {React.HTMLAttributes<HTMLDivElement>}
* */
interface EmptyStatePaneProps extends React.HTMLAttributes<HTMLDivElement> {
    images?: Array<ImageType>;
    title: string;
    children?: React.ReactNode;
}

/**
 * Renders an empty state component with images, a title, and children.
 *
 * @param {EmptyStatePaneProps} props - The component props.
 * @param {Array<ImageType>} props.images - An array of image objects.
 * @param {string} props.title - The title of the component.
 * @param {React.ReactNode} [props.children] - The children of the component.
 * @return {JSX.Element} The rendered empty state component.
 */
export function EmptyStatePane({
    images,
    title,
    children,
}: EmptyStatePaneProps) {
    const [activeId, setActive] = useState(1);

    return (
        <div className="h-[calc(100vh-200px)] w-full">
            <div className="mt-8 flex flex-col items-center justify-center h-full">
                <div className="text-[#878787] rounded-md py-1.5 px-3 border text-sm mb-8">
                    Coming soon
                </div>

                {images && images.length === 0 && (
                    <div className="pb-8 relative h-[251px] w-[486px]">
                        {images.map((image) => (
                            <Fragment key={image.id}>
                                <Image
                                    quality={100}
                                    src={image.src}
                                    width={486}
                                    height={251}
                                    alt="Overview"
                                    className={cn(
                                        "w-full opacity-0 absolute transition-all hidden dark:block",
                                        image.id === activeId && "opacity-1"
                                    )}
                                />

                                <Image
                                    quality={100}
                                    src={image.src2}
                                    width={486}
                                    height={251}
                                    alt="Overview"
                                    className={cn(
                                        "w-full opacity-0 absolute transition-all block dark:hidden",
                                        image.id === activeId && "opacity-1"
                                    )}
                                />
                            </Fragment>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center flex-col mt-8 text-center">
                    <h2 className="font-medium mb-4">{title}</h2>
                    {children}
                </div>

                {images && images.length > 0 && (
                    <div className="flex justify-between mt-12 items-center">
                        <div className="flex space-x-2">
                            {images.map((image) => (
                                <button
                                    type="button"
                                    onMouseEnter={() => setActive(image.id)}
                                    onClick={() => setActive(image.id)}
                                    key={image.id}
                                    className={cn(
                                        "w-[16px] h-[6px] rounded-full bg-[#1D1D1D] dark:bg-[#D9D9D9] opacity-30 transition-all cursor-pointer",
                                        image.id === activeId && "opacity-1"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
