"use client";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  ScrollShadow,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { cn } from "@nextui-org/theme";
import React, { useState, useRef, useEffect } from "react";
import { title } from "@/components/primitives";

export default function Home() {
  const [stories, setStories] = useState([
    { key: "example_1.txt", label: "example_1.txt" },
    { key: "example_2.txt", label: "example_2.txt" },
    { key: "Chapter 1 - Blank", label: "Chapter 1 - Blank" },
  ]);
  function example(example_name : string) {
    const [fileContent, setFileContent] = useState('');
  
    useEffect(() => {
      const fetchFile = async () => {
        try {
          const response = await fetch("input-txt"+example_name); // Path to the file in the public directory
          const text = await response.text();
          setFileContent(text);
        } catch (error) {
          console.error('Error fetching file:', error);
        }
      };
  
      fetchFile();
    }, []);
  
    return (
      <div>
        <p>{fileContent}</p>
      </div>
    );
  }
  
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Place your changes here</span>
      </div>
      <div className="mt-8 gap-16">
        <Snippet hideCopyButton hideSymbol className="gap-4" variant="bordered">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
          <span>Please feel free to use the example components below.</span>
        </Snippet>
      </div>
      <div className="pt-6 w-48">
        
        <Select
          items={stories}
          label="Story"
          placeholder="import TXT"
        >
          {(story) => <SelectItem key={story.key}>{story.label}</SelectItem>}
        </Select>
      </div>

      <div className="pt-6">
        <div className="flex flex-row ">
          <div
            className={cn(
              "relative flex h-full w-96 max-w-[384px] flex-1 flex-col !border-r-small border-divider pr-6 transition-[transform,opacity,margin] duration-250 ease-in-out",
            )}
            id="menu"
          >
            <header className="flex items-center text-md font-medium text-default-500 group-data-[selected=true]:text-foreground">
              <Icon
                className="text-default-500 mr-2"
                icon="solar:clipboard-text-outline"
                width={24}
              />
              Chapters
            </header>
            <ScrollShadow
              className="max-h-[calc(500px)] -mr-4"
              id="menu-scroll"
            >
              <div className="flex flex-col gap-4 py-3 pr-4">
                <Card
                  key="card-1"
                  isPressable
                  className={`max-w-[384px] border-1 border-divider/15 bg-themeBlue/20`}
                  shadow="none"
                >
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <Chip
                        className="mr-1 text-themeBlue bg-themeBlue/20"
                        radius="sm"
                        size="sm"
                        variant="flat"
                      >
                        Editing
                      </Chip>
                      <p className="text-left mr-1">
                        Chapter 1 - Chapter 1 title
                      </p>
                    </div>
                  </CardHeader>

                  <Divider />
                  <CardBody>
                    <p className="line-clamp-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip
                    </p>
                  </CardBody>
                </Card>
                <Card
                  key="card-2"
                  isPressable
                  className={`max-w-[384px] border-1 border-divider/15`}
                  shadow="none"
                >
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <p className="text-left mr-1">
                        Chapter 2 - Chapter 2 title
                      </p>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <p className="line-clamp-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip
                    </p>
                  </CardBody>
                </Card>
                <Card
                  key="card-3"
                  isPressable
                  className={`max-w-[384px] border-1 border-divider/15`}
                  shadow="none"
                >
                  <CardHeader className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <p className="text-left mr-1">
                        Chapter 3 - Chapter 3 title
                      </p>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <p className="line-clamp-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip
                    </p>
                  </CardBody>
                </Card>
              </div>
            </ScrollShadow>
          </div>

          <div className="w-full flex-1 flex-col min-w-[600px] pl-4">
            <div className="flex flex-col">
              <header className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-3">
                  <Button isIconOnly size="sm" variant="light">
                    <Icon
                      className="hideTooltip text-default-500"
                      height={24}
                      icon="solar:sidebar-minimalistic-outline"
                      width={24}
                    />
                  </Button>
                  <h4 className="text-md">Chapter 1 - Chapter 1 title</h4>
                </div>
              </header>
              <div className="w-full flex-1 flex-col min-w-[400px]">
                <div className={cn("flex flex-col gap-4")}>
                  <div className="flex flex-col items-start">
                    <div className="relative mb-5 w-full h-[400px] bg-slate-50 dark:bg-gray-800 rounded-lg">
                      <div className="absolute inset-x-4 top-4 z-10 flex justify-between items-center">
                        <div className="flex justify-between">
                          <Button
                            className="mr-2 bg-white dark:bg-gray-700"
                            size="sm"
                            startContent={
                              <Icon
                                className="text-default-500"
                                icon="ant-design:highlight-outlined"
                                width={24}
                              />
                            }
                            variant="flat"
                          >
                            button-1
                          </Button>
                        </div>

                        <Button
                          className="mr-2 bg-white dark:bg-gray-700"
                          size="sm"
                          startContent={
                            <Icon
                              className="text-default-500"
                              icon="material-symbols:save-outline"
                              width={24}
                            />
                          }
                          variant="flat"
                        >
                          button-2
                        </Button>
                      </div>
                      <div>
                        <ScrollShadow className="editScrollShow absolute left-2 right-2 bottom-10 top-12 text-base p-3 resize-none rounded-md border-solid border-inherit bg-slate-50 dark:bg-gray-800">
                          <div className="flex w-full h-full bg-slate-50 dark:bg-gray-200 rounded-lg p-2">
                            {/* Adjusted to use flex display for layout */}
                            <textarea
                              className="flex-1 p-3 resize-none rounded-md border border-transparent bg-slate-50 dark:bg-gray-200 text-gray-900" // Use flex-1 to allow the textarea to fill available space
                            />
                            <div className="bg-gray-100 p-1 rounded-md self-end ml-2">
                              {/* Added margin-left to separate from textarea, align-self to position at the bottom */}
                            </div>
                          </div>
                        </ScrollShadow>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
