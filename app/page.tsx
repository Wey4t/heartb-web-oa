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
import { assert } from "console";

interface Chapter {
  title: string;
  content: string;
  isSelected: boolean;
  index: number;
}

export default function Home() {
  const [stories, setStories] = useState([
    { key: "/example-1.txt", label: "Example 1" },
    { key: "/example-2.txt", label: "Example 2" },

    { key: "/example-3.txt", label: "Example 3" },
    { key: "/example-4.txt", label: "Example 4" },
    { key: "/example-5.txt", label: "Example 5" },
  ]);
  
  const [selectedFile, setSelectedFile] = useState("");
  const [currentChapter, setCurrentChapter] = useState<Chapter | undefined>();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [editingContent, setEditingContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [openChapterMenu, setOpenChapterMenu] = useState<number | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openChapterMenu !== null) {
        const target = event.target as HTMLElement;
        const isOutsideMenu = !target.closest('.chapter-menu-button') && 
                              !target.closest('.m-2');
        
        if (isOutsideMenu) {
          setOpenChapterMenu(null);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openChapterMenu]);
  
  const toggleChapterMenu = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (openChapterMenu === index) {
      setOpenChapterMenu(null);
    } else {
      setOpenChapterMenu(index);
      console.log("hry",index,openChapterMenu)

    }
  };

 
  const insertChapterSplit = () => {
    console.log(textareaRef)
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const cursorPos = textarea.selectionStart;
    const textBefore = textarea.value.substring(0, cursorPos);

    const textAfter = textarea.value.substring(cursorPos);
    const spliter = '\n====SPLIT CHAPTER====\n'
    const newText = `${textBefore}${spliter}${textAfter}`;
    
    // Update the current chapter content
    if (currentChapter) {
      const updatedChapter = { ...currentChapter, content: newText };
      const updatedChapters = chapters.map(c => 
        c.isSelected ? updatedChapter : c
      );
      
      setChapters(updatedChapters);
      setCurrentChapter(updatedChapter);
      setEditingContent(updatedChapter.content)
      
    }
  };

  // Split the chapter at the markers
  const splitChapter = () => {
    if (!currentChapter) return;
    
    const spliter= "\n====SPLIT CHAPTER====\n";
    
    const content = currentChapter.content;
    const parts = content.split(spliter);
    if (parts.length <= 1) return;
    const updatedCurrentChapter = {
      ...currentChapter,
      content: parts[0].trim(),
      isSelected: true
    };
    const currentIndex = chapters.findIndex(c => c.isSelected )

    const newChapters = parts.slice(1).map((part,index) => {
      return {
        title: `Chapter ${currentIndex+index+1}`,
        content:part.trim(),
        isSelected: false,
        index:0,
      }
    })
    const updatedChapters = [
      ...chapters.slice(0, currentIndex),
      updatedCurrentChapter,
      ...newChapters,
      ...chapters.slice(currentIndex + 1)
    ];
    const reIndexChapters = updatedChapters.map(
      (ch,i) => {
        return {
          ...ch,
          title:`Chapter ${i+1}`,
          index:i,
        }
      }
    )
    setChapters(reIndexChapters)
    setEditingContent(updatedCurrentChapter.content)
    setCurrentChapter(updatedCurrentChapter)
  }
  const combineWithNextChapter = (index: number) => {
    // Check if there is a next chapter
    console.log(currentChapter, chapters[index])
    if (index >= chapters.length - 1 || currentChapter != chapters[index]) return;
    
    const nextChapter = chapters[index + 1];
    
    const combinedContent = `${currentChapter.content}\n${nextChapter.content}`;
    
    // Update the current chapter with new content
    const updatedChapter = {
      ...currentChapter,
      content: combinedContent,
      isSelected: true
    };
    
    const updatedChapters = [
      ...chapters.slice(0, index),
      updatedChapter,
      ...chapters.slice(index + 2)
    ];
    
    const reIndexedChapters = updatedChapters.map((ch, i) => ({
      ...ch,
      title: `Chapter ${i+1}`,
      index: i,
      isSelected: i === index
    }));
    
    setChapters(reIndexedChapters);
    setCurrentChapter(updatedChapter);
    setEditingContent(combinedContent);
    
    setOpenChapterMenu(null);
  };
  
  const handleChapterAction = (action: string, index: number) => {
    switch (action) {
      case "combine":
        combineWithNextChapter(index);
        break;
      // Add other actions here as needed
      default:
        break;
    }
  };
  const handleChapterSelect = (index: number) => {
    let current = null
    const updatedChapters = chapters.map((chapter, i) => ({
      ...chapter,
      isSelected:false,
    }));
    updatedChapters[index].isSelected = true
    setCurrentChapter(updatedChapters[index])
    setChapters(updatedChapters);
    setEditingContent(updatedChapters[index].content);
    setOpenChapterMenu(null);

  };
  const parseChapters = (content: string): Chapter[] => {
    // Different patterns for chapter detection
    const chapterPatterns = [
      // Pattern for "Chapter X:" or "Chapter X -"
      // Chapter\s+([IVXLCDM0-9]+|[A-Za-z]+)[\s:-]+([^\n]+)/g,
      // Pattern for section breaks with "---CHAPTER END---"
      // /---CHAPTER END---/g,
      // Pattern for section breaks with "---"
      // /^---$/gm,
    ];
    
    let chaptersArray: Chapter[] = [];
    
    const chapterMatches = Array.from(content.matchAll(/Chapter\s+([IVXLCDM0-9]+|[A-Za-z]+)[\s:-]+([^\n]+)/g));
    
    if (chapterMatches.length > 0) {
      let lastIndex = 0;
      
      chapterMatches.forEach((match, index) => {
        const chapterTitle = `Chapter ${chaptersArray.length+1}`;
        const startIndex = match.index;
        
        // If not the first chapter, add the previous chapter
        if (index > 0) {
          const previousChapterContent = content.substring(lastIndex, startIndex).trim();
          chaptersArray[index - 1].content = previousChapterContent;
        }
        
        // Add the new chapter
        chaptersArray.push({
          title: chapterTitle,
          content: "",
          isSelected: false, 
          index:0,
        });
        
        lastIndex = startIndex + match[0].length;
      });
      
      if (chaptersArray.length > 0) {
        chaptersArray[chaptersArray.length - 1].content = content.substring(lastIndex).trim();
      }
    } 
    
    // Try the third pattern (---)
    else {
      chaptersArray = [{
        title: `Chapter 1`,
        content: content,
        isSelected: false,
        index:0
      }];
    }
    
    return chaptersArray;
  };
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditingContent(newContent);
    
    // Update the content in the chapters array
    const updatedChapters = chapters.map(chapter => {
      if (chapter.isSelected) {
        return { ...chapter, content: newContent };
      }
      return chapter;
    });
    
    setChapters(updatedChapters);
  };
  const handleFileSelect = async (key: string) => {
    if (key != "" && key != selectedFile){
      setSelectedFile(key);
      try {
        // Fetch the file content from the public directory
        console.log(key)
        const response = await fetch(`input-txt${key}`);
        const text = await response.text();
        console.log(text)
        
        // Parse the chapters from the content
        const parsedChapters = parseChapters(text);
        console.log(parsedChapters.length)
        setChapters(parsedChapters);
        
        // Set the editing content to the first chapter
        if (parsedChapters.length > 0) {
          setEditingContent(parsedChapters[0].content);
          setCurrentChapter(parsedChapters[0]);

        }
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    }
  };
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
     
      <div className="pt-6 w-48">
        
        <Select
          items={stories}
          label="Import TXT"
          placeholder="Select a file"
          onChange={(e) => handleFileSelect(e.target.value)}
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
                {chapters.map((chapter, index) => (
                  <Card
                    key={`chapter-${index}`}
                    isPressable
                    className={`max-w-[384px] border-1 border-divider/15 ${
                      chapter.isSelected ? "bg-themeBlue/20" : ""
                    }`}
                    shadow="none"
                    onClick={() => handleChapterSelect(index)}
                  >
                    <CardHeader className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {chapter.isSelected && (
                          <Chip
                            className="mr-1 text-themeBlue bg-themeBlue/20"
                            radius="sm"
                            size="sm"
                            variant="flat"
                          >
                            Editing
                          </Chip>
                        )}
                        <p className="text-left mr-1">
                          {chapter.title}
                        </p>
                      </div>
                      <Button 
                        isIconOnly 
                        size="sm" 
                        variant="light"
                        className="chapter-menu-button"
                        onClick={
                          (e) => {
                            handleChapterSelect(index),
                            toggleChapterMenu(index, e)
                          }
                        }
                      >
                        <Icon icon="mdi:dots-vertical" />
                      </Button>
                      {openChapterMenu === index && chapter.isSelected && (
                        <div 
                          className="absolute right-0 top-8 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            className="m-2"
                            size="sm"
                            color="secondary"
                            isDisabled={index >= chapters.length - 1}
                            onClick={() => combineWithNextChapter(index)}
                          >
                            Combine with next chapter
                          </Button>
                        </div>
                      )}
                    </CardHeader>

                    <Divider />
                    <CardBody>
                      <p className="line-clamp-2">
                        {chapter.content?.substring(0, 150)}...
                      </p>
                    </CardBody>
                  </Card>
                ))}
                
                {/* Show an empty state if no chapters are available */}
                {chapters.length === 0 && (
                  <Card className="max-w-[384px] border-1 border-divider/15" shadow="none">
                    <CardBody>
                      <p className="text-center text-default-500">
                        No chapters available. Please select a file to import.
                      </p>
                    </CardBody>
                  </Card>
                )}
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
                  <h4 className="text-md">Chapter {currentChapter?.title}</h4>
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
                            onClick={insertChapterSplit}
                          >
                            Insert chapter split
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
                          onClick={splitChapter}
                        >
                          Split
                        </Button>
                      </div>
                      <div>
                        <ScrollShadow className="editScrollShow absolute left-2 right-2 bottom-10 top-12 text-base p-3 resize-none rounded-md border-solid border-inherit bg-slate-50 dark:bg-gray-800">
                          <div className="flex w-full h-full bg-slate-50 dark:bg-gray-200 rounded-lg p-2">
                            {/* Adjusted to use flex display for layout */}
                            <textarea
                              ref={textareaRef}
                              className="flex-1 p-3 resize-none rounded-md border border-transparent bg-slate-50 dark:bg-gray-200 text-gray-900" // Use flex-1 to allow the textarea to fill available space
                              value={editingContent}
                              onChange={handleContentChange}
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
