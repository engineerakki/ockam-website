import { ReactElement, ReactNode } from 'react';
import { Box, Flex, Heading, SimpleGrid } from '@chakra-ui/react';
import path from 'path';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import { generateSlugFromPath, getPageBySlug, pageFilePaths } from '@api/mdxApi';
import mdxComponents from '@components/mdx';
import { NextPageWithLayout } from '@typings/NextPageWithLayout';
import LandingLayout from '@layouts/LandingLayout';
import { Hero } from '@views/homepage';
import SEOHead from '@root/components/SEOHead';
import { ContactForm } from '@views/contact-form';
import { Feature } from '@root/views/homepage/Features';

export const LANDING_PAGE_PATH = path.join(process.cwd(), 'src/content/landing-pages');

type ParamsType = {
  params: { slug: string };
};

export const getStaticPaths = async (): Promise<{
  paths: ParamsType[];
  fallback: boolean;
}> => {
  const paths = pageFilePaths(LANDING_PAGE_PATH)
    .map((p) => generateSlugFromPath(p))
    .map((slug) => ({ params: { slug } }));

  return {
    paths,
    fallback: false,
  };
};

type PageProps = {
  slug: string;
  source: MDXRemoteSerializeResult;
  frontMatter: { [key: string]: string | number | boolean };
};

export const getStaticProps = async ({ params }: ParamsType): Promise<{ props: PageProps }> => {
  const { source, frontMatter } = await getPageBySlug(LANDING_PAGE_PATH, params.slug);
  const { slug } = params;
  return {
    props: {
      slug,
      source,
      frontMatter,
    },
  };
};

type FrontmatterFeature = {
  icon: string;
  title: string;
  text: string;
};
const LandingPage: NextPageWithLayout<PageProps> = ({ slug, source, frontMatter }) => {
  const title = (frontMatter?.metaTitle as string) || (frontMatter?.title as string) || '';
  const text = frontMatter?.hero_text as string;
  const subtext = frontMatter?.subtext as string;
  const features: FrontmatterFeature[] =
    (frontMatter?.features as unknown as FrontmatterFeature[]) || [];

  const displayFeatures = (): JSX.Element => {
    if (Array.isArray(features) && features.length < 1) return <></>;
    return (
      <SimpleGrid
        id="features"
        columns={{ base: 1, md: 1, lg: 1 }}
        spacingX={{ base: 8, md: 20, lg: 24 }}
        spacingY={{ base: 8, md: 12, lg: 12 }}
      >
        {features.map((feature) => (
          <Feature
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            text={feature.text}
          />
        ))}
      </SimpleGrid>
    );
  };
  return (
    <Box pt={{ base: 10, lg: 10 }}>
      <SEOHead title={title} />
      <Hero text={text} subtext={subtext} landingPage />

      {/* <Features />
      <Cases />
      <GetStarted /> */}

      <Flex
        w="full"
        pt={{ base: 12, md: 24 }}
        pb={{ base: 24, md: 32 }}
        justify={{ base: 'center', lg: 'center' }}
        align="center"
        gap={{ base: 0, lg: 10 }}
        maxW={{ base: '3xl', lg: '3xl' }}
        direction="column"
        mx="auto"
        id="why"
      >
        <MDXRemote {...source} components={mdxComponents} />
        {displayFeatures()}
        <Heading id="contact">Speak to our sales team today!</Heading>
        <ContactForm landingPage={slug} />
      </Flex>
    </Box>
  );
};

LandingPage.getLayout = (page: ReactElement): ReactNode => <LandingLayout>{page}</LandingLayout>;

export default LandingPage;