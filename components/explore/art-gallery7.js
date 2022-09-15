import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

function Card(props) {
    return (
        <Link
              href={{
                pathname: `/market/${props.item.tokenId}/`,
                query: {
                  id: `${props.item.itemId}`,
                },
              }}
            >
        <div className=' relative w-[96%] ml-[2%] h-[620px] rounded-lg overflow-hidden hover:shadow-xl cursor-pointer'>
            <img src={props.item.image} alt={props.item.name} className="w-auto h-full object-cover"></img>
            <div className='absolute top-4 right-4 flex flex-col justify-center box-border text-[16px] border-[2px]  rounded-[10px] px-[10px] py-[4px] backdrop-blur-[10px] border-[#fff] bg-[#00000033] font-medium h-[30px] text-[#fff]'>Live</div>
            <div className=' absolute bottom-0 bg-gradient-to-b from-[#30333900] to-[#3e3f40e6] w-full h-[220px] p-[16px] pt-[40px] flex flex-col justify-end items-start'>
                <p className='text-[20px] font-semibold text-[#fff]'>{props.item.name}</p>
                <p className='text-[14px] mt-[12px] font-normal text-[#fff]'>{props.item.category}</p>
            </div>
        </div>
        </Link>
    )
}

const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 760 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 760, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };

export default function ArtGallery7(props) {
  return (
    // <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
    //     {
    //         props.galleries.map((item, index) => (
    //             <Card item={item}></Card>
    //         ))
    //     }
    // </div>
    <Carousel
        swipeable={false}
        draggable={false}
        showDots={true}
        responsive={responsive}
        ssr={true} // means to render carousel on server-side.
        infinite={true}
        autoPlay={false}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        className=""
        // containerClass="carousel-container"
        // dotListClass="custom-dot-list-style"
        // itemClass="carousel-item-padding-40-px"
    >
    {
            props.galleries.map((item, index) => (
                
                <Card key={index} item={item}></Card>

            ))
        }
    </Carousel>
  )
}
