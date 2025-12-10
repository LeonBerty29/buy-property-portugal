import DiscoverSection from '@/components/home/discover-section'
import { ContactSection } from '@/components/shared/contact-section'
import React from 'react'

const BlogLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <div className='pt-24'>
            
            {children}
            <ContactSection theme='dark' />
            <DiscoverSection />
        </div>
    )
}

export default BlogLayout