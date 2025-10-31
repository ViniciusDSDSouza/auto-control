"use client";

import { Box, Text, Link } from "@chakra-ui/react";
import NextLink from "next/link";

interface AuthLinkProps {
  question: string;
  linkText: string;
  href: string;
}

export function AuthLink({ question, linkText, href }: AuthLinkProps) {
  return (
    <Box textAlign="center" mt={4}>
      <Text fontSize="sm" color="gray.600" display="inline">
        {question}{" "}
      </Text>
      <Link
        as={NextLink}
        href={href}
        color="orange.600"
        fontWeight="semibold"
        fontSize="sm"
        _hover={{
          color: "orange.700",
          textDecoration: "underline",
        }}
        transition="color 0.2s"
      >
        {linkText}
      </Link>
    </Box>
  );
}
